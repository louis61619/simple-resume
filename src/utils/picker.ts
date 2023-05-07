import { env } from "../env.mjs";

const driveUploadPath = "https://www.googleapis.com/upload/drive/v3/files";

const API_KEY = env.NEXT_PUBLIC_GOOGLE_API_KEY;
const APP_ID = env.NEXT_PUBLIC_GOOGLE_APP_ID;

export function createPicker(
  accessToken: string,
  cb: (responseObject: google.picker.ResponseObject) => void = () => {
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

export async function newResume(filename: string, content: string) {
  const fileMetadata = {
    name: filename + ".md",
  };
  const file = await gapi.client.drive.files.create({
    resource: fileMetadata,
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
      body: content,
    });

    return fileId;
  }
}

async function renameFile(driveId: string, newName: string) {
  const params: any = {
    fileId: driveId,
    name: newName,
    fields: "id",
  };

  return new Promise((resolve, reject) => {
    gapi.client.drive.files
      .update(params)
      .then((response) => resolve(response.result), reject);
  });
}

export async function saveResume(
  filename: string,
  content: string,
  fileId: string
) {
  const promise1 = gapi.client.request({
    path: driveUploadPath + "/" + fileId,
    method: "PATCH",
    params: { uploadType: "media", fields: "id" },
    body: content,
  });
  const promise2 = renameFile(fileId, filename);
  return Promise.all([promise1, promise2]);
}

export function checkIsPublish(fileInfo: gapi.client.drive.File) {
  if (
    fileInfo.permissions?.length &&
    fileInfo.permissions.find((x) => x.id === "anyoneWithLink")
  ) {
    return true;
  } else {
    return false;
  }
}

export async function getFileDescription(
  fileId: string
): Promise<gapi.client.drive.File> {
  return new Promise((resolve) => {
    gapi.client.drive.files
      .get({
        fileId: fileId,
        fields: "id,version,name,appProperties,permissions",
        // oauth_token: accessToken,
      })
      .execute((response) => {
        resolve(response.result);
      });
  });
}

export async function getFileConent(fileId: string) {
  const res = await gapi.client.drive.files.get({
    fileId: fileId,
    // oauth_token: accessToken,
    // fields: "*",
    alt: "media",
  });

  return res.body;
}

export async function publishResume(fileId: string) {
  return gapi.client.request({
    path:
      "https://www.googleapis.com/drive/v3/files/" + fileId + "/permissions",
    method: "POST",
    body: {
      role: "reader",
      type: "anyone",
    },
  });
}

export async function unpublishResume(fileId: string) {
  return gapi.client.request({
    path:
      "https://www.googleapis.com/drive/v3/files/" +
      fileId +
      "/permissions/anyoneWithLink",
    method: "delete",
  });
}
