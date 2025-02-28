import { useState } from "react";

const useDeleteConfirm = (deleteFn) => {
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const openConfirm = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDeletion = async () => {
    if (itemToDelete) {
      await deleteFn(itemToDelete.id);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  return { itemToDelete, deleteConfirmOpen, openConfirm, confirmDeletion, setDeleteConfirmOpen };
};

export default useDeleteConfirm;