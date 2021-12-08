import { Mutation, Action, Module, VuexModule } from "vuex-module-decorators";
import axios from "axios";
import { AxiosResponse } from "axios";
import { IMemory } from "@/shared-structures/IMemory";
import Memories from "../assets/js/memories";

@Module({
  name: "memoriesStore",
  stateFactory: true,
  namespaced: true,
})
export default class MemoriesStore extends VuexModule {
  memories: IMemory[] = [];
  overlayId = -1;

  showMenu = false;

  error: string | null = null;

  @Action
  getData(): Promise<void> {
    //const url = `https://script.google.com/macros/s/AKfycbzZahwCTiV3myxP1w72oza-Tad8l6bpTL1bUcnCOhmoVnu89bmoyC9R7zg93MpN1GF7/exec`;
    const url = `https://script.google.com/macros/s/AKfycby9MeuoOclrkd1DBxdBLGfLssuyq-ECOehE9gUPCdX6KHr2LpyW3-WCQNTLBtkFEULq/exec?get=1`;
    return axios
      .get(url, {
        maxRedirects: 0,
      })
      .then((result) => {
        if (result.data && result.data.length > 0) {
          this.setMemories(result.data);
        } else {
          this.setMemories(Memories);
        }
      })
      .catch((err) => {
        //commit("setMenuProp", { prop: "formsDisabled", data: false });
        this.setMemories(Memories);
        console.log(err);
      });
  }

  @Mutation
  setMemories(obj: IMemory[]): void {
    this.memories = obj;
  }

  @Mutation
  setShowMenu(value: boolean): void {
    this.showMenu = value;
  }

  @Mutation
  setOverlayId(num: number): void {
    this.overlayId = num;
  }
}
