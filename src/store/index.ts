import { Store } from "vuex";
import { getModule } from "vuex-module-decorators";

import FormsStore from "./formsStore";
import MemoriesStore from "./memoriesStore";

type StoreType = {
  formsStore: FormsStore;
  memoriesStore: MemoriesStore;
};

export default function createStore(): Store<StoreType> {
  return new Store<StoreType>({
    modules: {
      formsStore: FormsStore,
      memoriesStore: MemoriesStore,
    },
    actions: {
      // async nuxtServerInit(_: never, ctx: Context): Promise<void> {
      //   const stateStore = getModule(StateStore, ctx.store);
      //   const rewardsStore = getModule(RewardsStore, ctx.store);
      //   const localizationsStore = getModule(LocalizationsStore, ctx.store);
      //   const { language } = ctx.route.params;
      //   rewardsStore.stateStore = stateStore;
      //   await Promise.all([
      //     stateStore.getSettings(),
      //     stateStore.getUser(language),
      //     stateStore.getStub(),
      //     localizationsStore.getLanguages(),
      //     localizationsStore.getCopyrights(language),
      //     localizationsStore.getLanguageSelector(),
      //   ]);
      // },
    },
  });
}
