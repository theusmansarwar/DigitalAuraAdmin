import { useMemo } from "react";

const useTruncateText = (text, maxLength) => {
  const truncateText = useMemo(() => {
    return text.length > maxLength ? text.slice(0, maxLength) + "....." : text;
  }, [text, maxLength]);

  return truncateText;
};

export default useTruncateText;
