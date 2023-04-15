import { env } from "../env.mjs";

const driveUploadPath = "https://www.googleapis.com/upload/drive/v3/files";

const API_KEY = env.NEXT_PUBLIC_GOOGLE_API_KEY;
const APP_ID = env.NEXT_PUBLIC_GOOGLE_APP_ID;

export function createPicker(
  accessToken: string,
  cb: () => void = () => {
    return;
  }
) {
  const docsView1 = new google.picker.DocsView(google.picker.ViewId.DOCS)
    .setIncludeFolders(true)
    .setOwnedByMe(true);
  // .setEnableDrives(true);
  const docsView2 = new google.picker.DocsView(google.picker.ViewId.DOCS)
    .setIncludeFolders(true)
    .setOwnedByMe(false);
  const docsView3 = new google.picker.DocsView(
    google.picker.ViewId.DOCS
  ).setStarred(true);

  const picker = new google.picker.PickerBuilder()
    // .enableFeature(google.picker.Feature.NAV_HIDDEN)
    .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
    .setDeveloperKey(API_KEY)
    .setAppId(APP_ID)
    .setOAuthToken(accessToken)
    // .addView(view)
    .addView(docsView1)
    .addView(docsView2)
    .addView(docsView3)
    .addView(google.picker.ViewId.RECENTLY_PICKED)
    .addView(new google.picker.DocsUploadView())
    .setCallback(cb)
    .build();
  picker.setVisible(true);
}

export async function newResume(
  accessToken: string,
  filename: string,
  content: string
) {
  const fileMetadata = {
    name: filename + ".md",
  };
  const file = await gapi.client.drive.files.create({
    resource: fileMetadata,
    oauth_token: accessToken,
    // media: media,
    fields: "id",
  });

  const fileId = file.result.id;
  if (fileId) {
    localStorage.setItem("fileId", fileId);

    await gapi.client.request({
      path: driveUploadPath + "/" + fileId,
      method: "PATCH",
      params: { uploadType: "media", fields: "id" },
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      body: content,
    });

    return fileId;
  }
}

async function renameFile(
  driveId: string,
  newName: string,
  accessToken: string
) {
  const params: any = {
    fileId: driveId,
    name: newName,
    fields: "id",
    oauth_token: accessToken,
  };

  return new Promise((resolve, reject) => {
    gapi.client.drive.files
      .update(params)
      .then((response) => resolve(response.result), reject);
  });
}

export async function saveResume(
  accessToken: string,
  filename: string,
  content: string,
  fileId: string
) {
  const promise1 = gapi.client.request({
    path: driveUploadPath + "/" + fileId,
    method: "PATCH",
    params: { uploadType: "media", fields: "id" },
    body: content,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  const promise2 = renameFile(fileId, filename, accessToken);
  return Promise.all([promise1, promise2]);
}
