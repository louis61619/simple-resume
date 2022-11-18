/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */


// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/drive";

const driveUploadPath = 'https://www.googleapis.com/upload/drive/v3/files';

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID =
  "710599532607-4oos62k4o44hdkcq613rr3pv27fri8ug.apps.googleusercontent.com";
const API_KEY = "AIzaSyC0sWY2_ra9I7VoX7AbllPiA3fXYPSO6-E";

// TODO(developer): Replace with your own project number from console.developers.google.com.
const APP_ID = "710599532607";

let tokenClient;
let accessToken = localStorage.getItem('accessToken') || null;
let pickerInited = false;
let gisInited = false;
let fileId =localStorage.getItem('fileId') || null;

if (accessToken) {
  // document.getElementById("signout_button").style.visibility = "visible";
  // document.getElementById("authorize_dialog").style.display = "none";
  document.getElementById("new_dialog").style.display = "none";
  // document.getElementById("dialog_bg").style.display = "none";
  if (fileId) {
    document.getElementById("folder_dialog").style.display = "none";
  }
} else {
  // 初始化
  // document.getElementById("loading").style.display = "none";
  document.getElementById("folder_dialog").style.display = "none";
  document.getElementById("new_dialog").style.display = "none";
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
  // tokenClient.callback = async (response) => {
  //   if (response.error !== undefined) {
  //     throw response;
  //   }
  //   accessToken = response.access_token;
  //   localStorage.setItem('accessToken', accessToken)
    
  // };
  gisInited = true;
  maybeEnableButtons();
}

async function getFileDescription (driveId) {
  return new Promise( (resolve, reject) => {
    gapi.client.drive.files.get({
      'fileId': driveId,
      'fields': 'id,version,name,appProperties',
    }).execute(
      (response) => resolve(response)
    );
  });
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
  if (pickerInited && gisInited) {
    setTimeout(() => {
      document.getElementById("loading").style.display = "none";
    }, 0)
  }
  // if (accessToken !== null) {
  //   tokenClient.requestAccessToken({ prompt: "" });
  // }
}

async function newResume() {
  const filename = document.getElementById("new_resume_name").value
  document.getElementById('resume_name').value = filename
  const fileMetadata = {
    name: filename + '.md',
  };
  try {
    let str = '';
    console.log(document.getElementById('with_template').checked)
    if (document.getElementById('with_template').checked) {
      str = sample
    }
    text.value = str
    content.innerHTML = marked.parse(str);
    
    document.getElementById("new_dialog").style.display = "none";
    document.getElementById("dialog_bg").style.display = "none";

    const file = await gapi.client.drive.files.create({
      resource: fileMetadata,
      // media: media,
      fields: 'id',
    });

    fileId = file.result.id
    localStorage.setItem('fileId', file.result.id);

    const res = await gapi.client.request({
      'path': driveUploadPath + '/' + fileId,
      'method': 'PATCH',
      'params': {'uploadType': 'media', 'fields': 'id'},
      'body': str
    })
    
  } catch (err) {
    // TODO(developer) - Handle error
    if (err.status === 401) {
      alert('登入時間過期')
    }
    throw err;
  }
}

async function renameFile(driveId, newName) {
  return new Promise( (resolve, reject) => {
    gapi.client.drive.files.update({
      'fileId': driveId,
      'name': newName,
      'fields': 'id'
    }).then(
      (response) => resolve(response.result),
      reject
    );
  });
}

async function saveResume() {
  const promise1 = gapi.client.request({
    'path': driveUploadPath + '/' + fileId,
    'method': 'PATCH',
    'params': {'uploadType': 'media', 'fields': 'id'},
    'body': text.value
  })
  const promise2 = renameFile(fileId, document.getElementById('resume_name').value)
  Promise.all([promise1, promise2]).then((res) => {
    alert('保存成功')
    console.log(res)
  })
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
  tokenClient.callback = async (response) => {
    if (response.error !== undefined) {
      throw response;
    }
    console.log(response)
    accessToken = response.access_token;
    localStorage.setItem('accessToken', accessToken)
    document.getElementById("authorize_dialog").style.display = "none";
    document.getElementById("dialog_bg").style.display = "none";

    if (fileId) {
      gapi.client.drive.files.get({
        fileId: fileId,
        // fields: "*",
        alt: 'media'
      }).then(res => {
        text.value = res.body
        content.innerHTML = marked.parse(res.body);
      });
      getFileDescription(fileId).then(res => {
        document.getElementById('resume_name').value = res.name.replace(/\.md$/, '')
      })
    } else {
      document.getElementById("folder_dialog").style.display = "block";
    }
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
  accessToken = null;
  google.accounts.oauth2.revoke(accessToken);
  localStorage.clear()
  window.location.reload()
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

function createNewDialog() {
  window.document.getElementById("new_dialog").style.display = "block";
  window.document.getElementById("new_resume_name").value = `Untitled Resume`;
}

/**
 * Displays the file details of the user's selection.
 * @param {object} data - Containers the user selection from the picker
 */
async function pickerCallback(data) {
  if (data.action === google.picker.Action.PICKED) {
    window.document.getElementById("folder_dialog").style.display = "none";
    window.document.getElementById("dialog_bg").style.display = "none";
    // let text = `Picker response: \n${JSON.stringify(data, null, 2)}\n`;
    const document = data[google.picker.Response.DOCUMENTS][0];
    fileId = document[google.picker.Document.ID];
    localStorage.setItem('fileId', fileId)

    gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    }).then(res => {
      text.value = res.body
      content.innerHTML = marked.parse(res.body);
    });
    getFileDescription(fileId).then(res => {
      window.document.getElementById('resume_name').value = res.name.replace(/\.md$/, '')
    })
  }
}

function closeDialog(el) {
  el.parentElement.style.display = 'none'
}