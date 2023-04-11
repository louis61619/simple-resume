export default {
  data() {
    return { count: 0 }
  },
  template: `<div
    class="geDialog"
    style="
      width: 300px;
      height: 150px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10006;
    "
  >
    <slot></slot>
  </div>`,
  setup(props) {

  }
}

{/* <div style="text-align: center; max-height: 100%" id="authorize_content">
    <p style="font-size: 16pt; padding: 0px; margin: 0px; color: gray">
      需要授權
    </p>
    <p>在 Google Drive 中授權此應用：</p>
    <button
      class="geBigButton"
      style="margin-top: 6px; font-size: 18px; padding: 14px 20px"
      id="authorize_button"
      onclick="handleAuthClick()"
    >
      授權
    </button>
  </div> */}