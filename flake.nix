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
        astalPkgs.io
        astalPkgs.gjs
        astalPkgs.hyprland
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
      devDeps = [
        astalPkgs.astal3
        pkgs.gobject-introspection
        pkgs.nodejs_23
        pkgs.nodePackages.pnpm
      ];
    in {
      packages.default = pkgs.stdenvNoCC.mkDerivation rec {
        name = "midnightway";
        src = ./.;

        nativeBuildInputs = devDeps ++ [ pkgs.wrapGAppsHook ];

        buildInputs = deps;

        installPhase = ''
          mkdir -p $out/bin
          pnpm build $out/bin/${name}
        '';
      };

      devShells.default = pkgs.mkShell {
        packages = deps ++ devDeps;
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
