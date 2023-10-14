import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";

import { WordData } from "../interfaces/WordData";
import { ResponsiveWordCloudProps } from "../interfaces/ResponsiveWordCloudProps";

import Wordcloud from "@visx/wordcloud/lib/Wordcloud";

function ResponsiveWordCloud({
  words,
  colors,
  width,
  height,
}: ResponsiveWordCloudProps) {
  const minMax = 60;
  const maxMax = 100;

  const minWidth = 500;
  const maxWidth = 1000;

  const maxFontSize = Math.min(
    minMax + ((maxMax - minMax) * (width - minWidth)) / (maxWidth - minWidth),
    maxMax
  );

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, maxFontSize],
  });

  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  return (
    <div
      id="wordcloud"
      className="flex items-center mt-8 [&>svg]:my-2 [&>svg]:cursor-pointer [&>svg]:select-none [&>label]:inline-flex [&>label]:items-center [&>label]:text-[14px] [&>label]:mr-[8px] [&>textarea]:min-h-[100px]"
    >
      <Wordcloud
        words={words}
        width={width * 0.9}
        height={height * 0.9}
        fontSize={fontSizeSetter}
        font={"Impact"}
        padding={4}
        spiral={"archimedean"}
        rotate={0}
        random={() => 0.5}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </div>
  );
}

export default ResponsiveWordCloud;
