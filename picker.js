/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// 如何持久化登入狀態
// 寫入數據


// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/drive";

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID =
  "710599532607-4oos62k4o44hdkcq613rr3pv27fri8ug.apps.googleusercontent.com";
const API_KEY = "AIzaSyC0sWY2_ra9I7VoX7AbllPiA3fXYPSO6-E";

// TODO(developer): Replace with your own project number from console.developers.google.com.
const APP_ID = "710599532607";

let tokenClient;
let accessToken =null;
let pickerInited = false;
let gisInited = false;


if (accessToken) {
  // document.getElementById("signout_button").style.visibility = "visible";
  document.getElementById("authorize_dialog").style.display = "none";
} else {
  // 初始化
  // document.getElementById("loading").style.display = "none";
  document.getElementById("authorize_content").style.display = "none";
  document.getElementById("folder_dialog").style.display = "none";
  // document.getElementById("signout_button").style.visibility = "hidden";
}



/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
  gapi.load("client:picker", intializePicker);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializePicker() {
  await gapi.client.load(
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
  );
  pickerInited = true;
  maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (pickerInited && gisInited) {
    setTimeout(() => {
      document.getElementById("loading").style.display = "none";
    }, 0)
    
    document.getElementById("authorize_content").style.display = "block";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (response) => {
    if (response.error !== undefined) {
      throw response;
    }
    accessToken = response.access_token;
    localStorage.setItem('accessToken', accessToken)
    document.getElementById("signout_button").style.visibility = "visible";
    document.getElementById("authorize_dialog").style.display = "none";
    document.getElementById("folder_dialog").style.display = "block";
    // createPicker();
  };

  if (accessToken === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    // when establishing a new session.
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
  if (accessToken) {
    accessToken = null;
    google.accounts.oauth2.revoke(accessToken);
    document.getElementById("content").innerText = "";
    document.getElementById("signout_button").style.visibility = "hidden";
  }
}

/**
 *  Create and render a Picker object for searching images.
 */
function createPicker() {
  const view = new google.picker.View(google.picker.ViewId.DOCS);
  const docsView1 = new google.picker.DocsView(google.picker.ViewId.DOCS)
      .setIncludeFolders(true)
      .setOwnedByMe(true)
      // .setEnableDrives(true);
  const docsView2 = new google.picker.DocsView(google.picker.ViewId.DOCS).
      setIncludeFolders(true).
      setOwnedByMe(false);
  const docsView3 = new google.picker.DocsView(google.picker.ViewId.DOCS).
      setStarred(true)

  // console.log(view)
  // view.setMimeTypes('*');
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
    .setCallback(pickerCallback)
    .build();
  picker.setVisible(true);
}

/**
 * Displays the file details of the user's selection.
 * @param {object} data - Containers the user selection from the picker
 */
async function pickerCallback(data) {
  if (data.action === google.picker.Action.PICKED) {
    window.document.getElementById("folder_dialog").style.display = "none";
    // let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
    const document = data[google.picker.Response.DOCUMENTS][0];
    const fileId = document[google.picker.Document.ID];
    const res = await gapi.client.drive.files.get({
      fileId: fileId,
      // fields: "*",
      alt: 'media'
    });
    // text += `Drive API response for first document: \n${JSON.stringify(
    //   res.result,
    //   null,
    //   2
    // )}\n`;
    window.document.getElementById("content").innerText = res.body;
  }
}