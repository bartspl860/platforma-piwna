import { useState } from "react";
import { Input, Button, Group, rem } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

export function CommentInput({
  value,
  setValue,
  onSend,
  loading,
}: {
  value: string;
  setValue: (v: string) => void;
  onSend: () => void;
  loading: boolean;
}) {
  return (
    <Group gap={0} style={{ width: "100%" }} align="center">
      <Input
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
        placeholder="Opisz wrażenia..."
        size="md"
        style={{ flex: 1, minWidth: 0 }}
        styles={{
          input: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            fontSize: rem(16),
            minHeight: rem(44),
          },
        }}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey && value.trim()) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button
        size="md"
        px={18}
        disabled={!value.trim()}
        loading={loading}
        onClick={onSend}
        style={{
          marginLeft: -1,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          minHeight: rem(44),
          minWidth: rem(44),
        }}
        color="beer"
      >
        <IconSend size={20} />
      </Button>
    </Group>
  );
}
