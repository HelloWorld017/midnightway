{
  inputs = {
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixpkgs-unstable";
    };

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };

    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.systems.follows = "systems";
    };

    systems = {
      url = "github:nix-systems/default-linux";
    };
  };

  outputs = { nixpkgs, astal, ags, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      astalPkgs = astal.packages.${system};
      agsPkg = ags.packages.${system}.default;
      # AGS/Gnim export TypeScript sources. Provide declarations through the
      # standard "types" export condition so skipLibCheck applies to them too.
      agsJsPkg = agsPkg.jsPackage.overrideAttrs(oldAttrs: {
        nativeBuildInputs = (oldAttrs.nativeBuildInputs or []) ++ [ pkgs.typescript ];
        installPhase = oldAttrs.installPhase + ''
          tsc --declaration --emitDeclarationOnly --noCheck --target es2022 \
            --module preserve --moduleResolution bundler --rootDir "$out" --outDir "$out/types" \
            "$out"/lib/*.ts "$out"/lib/*/*.ts \
            "$out"/node_modules/gnim/dist/*.ts "$out"/node_modules/gnim/dist/*/*.ts
          mv "$out/types/node_modules/gnim" "$out/node_modules/gnim/types"
          ${pkgs.nodejs_24}/bin/node --input-type=module - "$out" <<'JS'
          import { readFileSync, writeFileSync } from 'node:fs';
          for (const suffix of ['/package.json', '/node_modules/gnim/package.json']) {
            const path = process.argv[2] + suffix;
            const pkg = JSON.parse(readFileSync(path, 'utf8'));
            pkg.exports = Object.fromEntries(Object.entries(pkg.exports).map(([key, source]) =>
              [key, { types: './types' + source.slice(1).replace(/\.ts$/, '.d.ts'), default: source }]));
            writeFileSync(path, JSON.stringify(pkg));
          }
          JS
        '';
      });

      deps = [
        astalPkgs.astal4
        astalPkgs.battery
        astalPkgs.hyprland
        astalPkgs.io
        astalPkgs.mpris
        astalPkgs.network
        (astalPkgs.notifd.overrideAttrs(oldAttrs: {
          patches = [
            ./patches/astal-notifd-images.patch
          ];
        }))
        astalPkgs.tray
        astalPkgs.wireplumber
        pkgs.glib
        pkgs.glib-networking
        pkgs.gjs
        pkgs.gtk4-layer-shell
        pkgs.libadwaita
        pkgs.libgtop
        pkgs.webkitgtk_6_0
      ];

      pnpm = pkgs.pnpm_10;
      devDeps = [
        astalPkgs.astal3
        pkgs.gobject-introspection
        pkgs.nodejs_24
        pnpm
      ];

      package = pkgs.stdenvNoCC.mkDerivation rec {
        pname = "midnightway";
        version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
        src = ./.;

        buildInputs = deps;
        nativeBuildInputs = devDeps ++ [
          pkgs.wrapGAppsHook4
          pnpm.configHook
        ];

        buildPhase = ''
          runHook preBuild
          pnpm build
          runHook postBuild
        '';

        installPhase = ''
          mkdir -p $out/bin $out/libexec/${pname}
          cp dist/*.js $out/libexec/${pname}
          echo '#!${pkgs.gjs}/bin/gjs -m' | cat - dist/index.js > $out/libexec/${pname}/${pname}
          chmod a+x $out/libexec/${pname}/${pname}
          ln -s $out/libexec/${pname}/${pname} $out/bin/${pname}

          runHook postInstall
        '';

        preFixup = ''
          gappsWrapperArgs+=(
            --set GSK_RENDERER "ngl"
            --set LD_PRELOAD "${pkgs.gtk4-layer-shell}/lib/libgtk4-layer-shell.so"
          )
        '';

        pnpmDeps = pnpm.fetchDeps {
          inherit pname version src EXTERN_AGS;
          fetcherVersion = 3;
          hash = "sha256-qF+ruDtivyQkgaaD8EISKoTVHgbBPr4XUWFXsi3N6hw=";
        };

        EXTERN_AGS = "${agsJsPkg}";
      };
    in {
      packages.default = package;
      devShells.default = pkgs.mkShell {
        packages = deps ++ devDeps; # ++ [ package ];
        shellHook = ''
          export XDG_DATA_DIRS="${pkgs.lib.concatMapStringsSep ":" (p: "${p.out or p}/share/gsettings-schemas/${p.name}") (deps ++ [pkgs.gtk4])}:$XDG_DATA_DIRS";
          export EXTERN_AGS="${agsJsPkg}";
          export EXTERN_GTK4_LAYER_SHELL="${pkgs.gtk4-layer-shell}/lib/libgtk4-layer-shell.so";
          export GIO_MODULE_DIR="${pkgs.glib-networking}/lib/gio/modules";
          export MIDNIGHTWAY_CONFIG_FILE="./config.json";
          export VIRTUAL_ENV="midnightway";
        '';
      };
    });
}
