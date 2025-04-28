import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";

import { Link } from "@cloudscape-design/components";

export const ComponentList = () => {
  return (
    <Cards
      ariaLabels={{
        itemSelectionLabel: (_e, t) => `select ${t.name}`,
        selectionGroupLabel: "Item selection"
      }}
      cardDefinition={{
        header: item => (
          <Link href={item.link} fontSize="heading-m">
            {item.name}
          </Link>
        ),
        sections: [
          {
            id: "description",
            header: "Description",
            content: item => item.description
          },
        ]
      }}
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 500, cards: 2 }
      ]}
      items={[
        {
          name: "リアルタイム翻訳",
          alt: "First",
          description: "Amazon TranslateとAmazon Transcribeを使用して音声をリアルタイムに翻訳します",
          link: "/audio_translate"
        },
        {
          name: "議事録生成",
          alt: "Second",
          description: "音声の文字起こしデータから詳細な議事録を生成します",
          link: "/meeting_minutes"
        }
      ]}
      loadingText="Loading resources"
      empty={
        <Box
          margin={{ vertical: "xs" }}
          textAlign="center"
          color="inherit"
        >
          <SpaceBetween size="m">
            <b>No resources</b>
            <Button>Create resource</Button>
          </SpaceBetween>
        </Box>
      }
    />
  );
}