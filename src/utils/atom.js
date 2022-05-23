import { atom } from "recoil";
const joinDialogAtom = atom({
  key: "joinDialogAtom",
  default: false,
});
const createDialogAtom = atom({
  key: "createDialogAtom",
  default: false,
});
const signoutAtom=atom({
  key:"signoutAtom",
  default:false,
})
export { createDialogAtom, joinDialogAtom , signoutAtom };