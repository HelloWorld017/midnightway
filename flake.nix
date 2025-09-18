{
  inputs = {
    nixpkgs = {
      url = "github:nixos/nixpkgs/nixos-unstable";
    };

    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.systems.follows = "systems";
    };

    systems = {
      url = "github:nix-systems/default-linux";
    };
  };

  outputs = { nixpkgs, astal, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      astalPkgs = astal.packages.${system};

      deps = [
        (astalPkgs.astal4.overrideAttrs(oldAttrs: {
          propagatedBuildInputs = oldAttrs.propagatedBuildInputs ++ [
            pkgs.cairo
          ];
          patches = [
            ./patches/astal4-fixed-exclusivity.patch
            ./patches/astal4-utils.patch
          ];
        }))
        astalPkgs.battery
        astalPkgs.gjs
        astalPkgs.hyprland
        astalPkgs.io
        astalPkgs.mpris
        astalPkgs.network
        astalPkgs.notifd
        astalPkgs.tray
        astalPkgs.wireplumber
        pkgs.libgtop
        pkgs.glib
        pkgs.glib-networking
        pkgs.gjs
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
          pkgs.wrapGAppsHook
          pnpm.configHook
        ];

        buildPhase = ''
          runHook preBuild
          pnpm build
          runHook postBuild
        '';

        installPhase = ''
          mkdir -p $out/bin $out/libexec
          cp dist/*.js $out/libexec
          echo '#!${pkgs.gjs}/bin/gjs -m' | cat - dist/index.js > $out/libexec/${pname}
          chmod a+x $out/libexec/${pname}
        '';

        preFixup = ''
          gappsWrapperArgs+=(
            --set GSK_RENDERER "ngl"
            --set LD_PRELOAD "${pkgs.gtk4-layer-shell}/lib/libgtk4-layer-shell.so"
          )
        '';

        pnpmDeps = pnpm.fetchDeps {
          inherit pname version src EXTERN_ASTAL;
          fetcherVersion = 2;
          hash = "sha256-BJebBVEjM4DtN4xRmPUelegDJQkvYdcSCEbjF6WLcp8=";
        };

        EXTERN_ASTAL = "${astalPkgs.gjs}/share/astal/gjs";
      };
    in {
      packages.default = package;
      devShells.default = pkgs.mkShell {
        packages = deps ++ devDeps ++ [ package ];
        shellHook = ''
          export EXTERN_ASTAL="${astalPkgs.gjs}/share/astal/gjs";
          export EXTERN_GTK4_LAYER_SHELL="${pkgs.gtk4-layer-shell}/lib/libgtk4-layer-shell.so";
          export GIO_MODULE_DIR="${pkgs.glib-networking}/lib/gio/modules";
          export MIDNIGHTWAY_CONFIG_FILE="./config.json";
          export VIRTUAL_ENV="midnightway";
        '';
      };
    });
}
