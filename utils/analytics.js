import ReactGA from "react-ga";
export const initGA = () => {
  ReactGA.initialize("UA-173730636-1");
};
export const logPageView = (path) => {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
};
export const logEvent = (category = "", action = "") => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};
export const logException = (description = "", fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
