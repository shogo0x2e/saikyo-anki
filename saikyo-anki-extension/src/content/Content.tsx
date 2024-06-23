import { DialogBox, DialogBoxProps } from "./DialogBox";

const Content = (props: DialogBoxProps & { orect: DOMRect }) => {
  const existingDialogs = document.getElementsByClassName('my-dialog-box');
  Array.from(existingDialogs).forEach(dialog => {
    if (document.contains(dialog)) {
      dialog.remove();
    } else {
      console.log('Trying to remove a dialog that is not in the document:', dialog);
    }
  });
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        left: '0px',
        top: '0px',
        zIndex: 2147483550,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: window.scrollX + props.orect[0].left,
          top: window.scrollY + props.orect[0].bottom + 10,
          zIndex: 2147483550,
        }}
      >
        
        <DialogBox {...props} />
      </div>
    </div>
  );
};

export default Content;