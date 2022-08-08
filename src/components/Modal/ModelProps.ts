export type ModalProps = {
  /**
   * Open modal dialog
   * value = true or false
   */
  open: boolean;
  title: string;
  message: string;
  ok?: () => void;
  cancel?: (value: boolean) => void;
  dismiss?: boolean;
  btnOkMessage: string;
  btnCancelMessage: string;
};
