import { Loading } from "element-ui";

const options = {
  lock: true,
  text: "拼命加载中...",
};

let loading;

export function startLoading() {
  loading = Loading.service(options);
}

export function endLoading() {
  loading.close();
}
