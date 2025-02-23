"use client";

import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Button,
  Typography,

} from "@mui/material";
import AdCampaignForm from "./AdCampaignForm";
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";

const AdCampaignModal: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [objective, setObjective] = useState("");
  const toast = useRef<Toast>(null);
  const router = useRouter();

  const handleClickOpen = (scrollType: DialogProps["scroll"]) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const showSuccessToast = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const showErrorToast = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error Message",
      detail: message,
      life: 3000,
    });
  };
  const handleReturn = async (e: boolean) => {
    if(e){
      handleClose()
      showSuccessToast("Successfully created new campaign");
      router.refresh();
    }
    else{
      handleClose()
      showSuccessToast("Couldnt create new campaign");
    }
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button
        onClick={handleClickOpen("paper")}
        variant="contained"
        sx={{
          marginRight: "10px",
          backgroundColor: "#597FB5 !important",
          color: "#fff !important",
          "&:hover": {
            backgroundColor: "#405D80 !important",
          },
        }}
      >
        Facebook
      </Button>

      <Dialog
      fullWidth 
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
            Create a Facebook Campaign
        </DialogTitle>

        <DialogContent dividers={scroll === "paper"}>
            <AdCampaignForm onReturn={handleReturn} />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default AdCampaignModal;
