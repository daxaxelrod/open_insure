export default function useIsTouchDevice(): boolean {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
