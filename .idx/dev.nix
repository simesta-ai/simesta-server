{ pkgs, ... }: {

  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.yarn
  ];

  # Sets environment variables in the workspace
#   env = {
#     SOME_ENV_VAR = "hello";
#   };

  # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
  idx.extensions = [
    "esbenp.prettier-vscode"
    "Orta.vscode-jest"
  ];
}