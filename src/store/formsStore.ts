import { Mutation, Action, Module, VuexModule } from "vuex-module-decorators";
import axios from "axios";
import { AxiosResponse } from "axios";
import { IMemory } from "@/shared-structures/IMemory";

@Module({
  name: "formsStore",
  stateFactory: true,
  namespaced: true,
})
export default class FormsStore extends VuexModule {
  data: IMemory | null = null;

  error: string | null = null;

  @Action
  submitForms(): Promise<void> {
    const url = `https://script.google.com/macros/s/AKfycby9MeuoOclrkd1DBxdBLGfLssuyq-ECOehE9gUPCdX6KHr2LpyW3-WCQNTLBtkFEULq/exec?get=0`;
    // const url = `https://script.google.com/macros/s/AKfycbzA2ADg2P3aDlLP2qLNAkfC9Xi9yuC4dglIG4rnuCrZhFBacF7hO/exec`;
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: this.data,
          maxRedirects: 0,
        })
        .then((result: any) => {
          resolve(result);
          //console.log("submit", result);
        })
        .catch((err) => {
          reject(err);
          // console.log("err", err);
          //commit("setMenuProp", { prop: "formsDisabled", data: false });
          //console.log(err);
        });
    });
  }

  @Mutation
  setData(obj: IMemory): void {
    this.data = obj;
  }
}
