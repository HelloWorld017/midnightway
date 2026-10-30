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
      agsJsPkg = agsPkg.jsPackage.overrideAttrs (old: {
        installPhase = old.installPhase + ''
          find \
            "$out/lib" \
            "$out/node_modules/gnim/dist" \
            -type f \( -name '*.ts' -o -name '*.tsx' \) \
            -exec sed -i '1i// @ts-nocheck' {} +
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

      pnpm = pkgs.pnpm_12;
      devDeps = [
        astalPkgs.astal3
        pkgs.gobject-introspection
        pkgs.nodejs_26
        pnpm
      ];

      package = pkgs.stdenvNoCC.mkDerivation rec {
        pname = "midnightway";
        version = (builtins.fromJSON (builtins.readFile ./package.json)).version;
        src = ./.;

        buildInputs = deps;
        nativeBuildInputs = devDeps ++ [
          pkgs.wrapGAppsHook4
          pkgs.pnpmConfigHook
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

        pnpmDeps = pkgs.fetchPnpmDeps {
          inherit pname version src EXTERN_AGS;
          fetcherVersion = 4;
          hash = "sha256-DgyHg0Medy9ofVOvgNXol68qlIEIq6iYxvM7iQTHFAs=";
        };

        EXTERN_AGS = "${agsJsPkg}";
      };
    in {
      packages.default = package;
      devShells.default = pkgs.mkShell {
        packages = deps ++ devDeps; # ++ [ package ];
        shellHook = let
          buildDataDirs =
            pkgs.lib.concatMapStringsSep ":" (p: "${p.out or p}/share/gsettings-schemas/${p.name}");
        in ''
          export XDG_DATA_DIRS="${buildDataDirs (deps ++ [pkgs.gtk4])}:$XDG_DATA_DIRS";
          export EXTERN_AGS="${agsJsPkg}";
          export EXTERN_GTK4_LAYER_SHELL="${pkgs.gtk4-layer-shell}/lib/libgtk4-layer-shell.so";
          export GIO_MODULE_DIR="${pkgs.glib-networking}/lib/gio/modules";
          export MIDNIGHTWAY_CONFIG_FILE="./config.json";
          export VIRTUAL_ENV="midnightway";
        '';
      };
    });
}
