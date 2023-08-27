import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as path from "path";


main().catch((err) => {
  core.setFailed(err.message);
});

async function main() {
  let version = core.getInput("version", {
    required: true,
    trimWhitespace: true,
  });

  core.startGroup(`Installing Algia ${version}`);

  const arch = process.arch === "x64" ? "amd64" : process.arch;
  const platformsDict = {
    'darwin': 'darwin',
    'freebsd': 'linux',
    'linux': 'linux',
    'openbsd': 'linux',
    'win32': 'windows',
  }
  const platform = platformsDict[process.platform]
  const platformExtensionsDict = {
    'linux': 'tar.gz',
    'darwin': 'zip',
    'windows': 'zip',
  }
  const ext = platformExtensionsDict[platform]

  try {
    let cachedPath = tc.find("algia", version);

    if (!cachedPath) {
      const baseDownloadUrl =
        "https://github.com/mattn/algia/releases/download";

      const downloadPath = await tc.downloadTool(
        `${baseDownloadUrl}/${version}/algia_${version}_${platform}_${arch}.${ext}`,
      );

      let extractPath;
      if (process.platform === 'win32') {
        extractPath = await tc.extractZip(downloadPath);
      }
      else if (process.platform === 'darwin') {
        extractPath = await tc.extractZip(downloadPath);
      }
      else {
        extractPath = await tc.extractTar(downloadPath, undefined, ["xzC"]);
      }

      cachedPath = path.join(await tc.cacheDir(extractPath, "algia", version), `algia_${version}_${platform}_${arch}`);
    }

    core.addPath(cachedPath);

    core.exportVariable("INSTALL_DIR_FOR_ALGIA", cachedPath);
  } catch (err) {
    core.error(
      `Algia install failed for platform '${process.platform}' on arch '${arch}'`,
    );

    core.error(`${err}\n${err.stack}`);

    throw new Error(`Could not install Algia ${version}`);
  }

  core.info(`Installed Algia ${version} (arch '${arch}')`);

  core.setOutput("version", version);

  core.endGroup();
}
