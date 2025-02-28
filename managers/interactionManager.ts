export const INTERACTIONS: Function[] = [
  () => {
    console.log("Interaction 0");
  },
  () => {
    console.log("Interaction 1");
  },
];

export default class interactionManager {
  public static interactionKey: number = -1;
  public static beginInteraction() {
    INTERACTIONS[this.interactionKey]();
  }
}
