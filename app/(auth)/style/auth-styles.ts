/** Golfer-modal look, passed into FormikController via className / fieldstyle. */
export const AUTH_STYLES = {
  // wrapper: styles the <label> child, adds spacing
  group:
    "space-y-2 [&>label]:block [&>label]:text-[13px] [&>label]:font-semibold",
  // input / select trigger / password
  input:
    "h-12 w-full rounded-xl border border-input bg-muted/60 px-3.5 text-[15px] text-foreground outline-none transition-colors " +
    "placeholder:text-muted-foreground focus:border-primary focus:ring-[3px] focus:ring-primary/20 " +
    "aria-[invalid=true]:border-destructive",
  error: "text-sm text-destructive",
} as const;
 