// Remotion's settings for the video module. The static files (narration, sound effects) live outside the module, in
// the repo's media/ folder, which the narration and sound modules write to: staticFile("narration/<name>/...").
import { Config } from "@remotion/cli/config";

Config.setPublicDir("../../media");
Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
