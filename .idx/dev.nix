{ pkgs, ... }: {
  # Use the stable channel for nix packages
  channel = "stable-23.11";

  # List the packages you want to have available in your workspace
  packages = [
    pkgs.nodejs_20 # Includes node, npm, npx
  ];

  # IDX's preview feature
  # See https://firebase.google.com/docs/studio/customize-workspace#previews
  idx.previews = [
    {
      # A unique identifier for the preview
      id = "web";
      # The command to start your web server
      command = "npm start";
      # The port your server will be listening on
      port = 8080;
      # A label for the preview tab in the IDE
      label = "Web Preview";
    }
  ];
}
