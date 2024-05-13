import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery
} from "react-query";

import "./index.css";

import { useVirtualizer } from "./react-virtual";

const queryClient = new QueryClient();

async function fetchServerPage(
  limit: number,
  offset: number = 0
): Promise<{ rows: string[]; nextOffset: number }> {
  const rows = new Array(limit)
    .fill(0)
    .map((e, i) => `Async loaded row #${i + offset * limit}`);

  await new Promise((r) => setTimeout(r, 500));

  return { rows, nextOffset: offset + 1 };
}

export function App() {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery(
    "projects",
    (ctx) => fetchServerPage(20, ctx.pageParam),
    {
      getNextPageParam: (_lastGroup, groups) => groups.length
    }
  );

  const allRows = data ? data.pages.flatMap((d) => d.rows) : [];

  const parentRef = React.useRef();

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    estimateSize: () => 100,
    getScrollElement: () => parentRef.current,
    // Keep this a little high. It "fixes" a bug where content may not get
    // adjusted to be visual when initially loading only a small amount of data.
    overscan: 50,
    reverse: true
  });

  const rowVirtualizerRef = useRef(rowVirtualizer);

  useEffect(() => {
    const [lastItem] = [
      ...rowVirtualizerRef.current.getVirtualItems()
    ].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems()
  ]);

  return (
    <div>
      <br />
      <br />

      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {(error as Error).message}</span>
      ) : (
        <div
          ref={parentRef}
          className="List"
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            height: `500px`,
            justifyContent: "flex-start",
            minHeight: "0",
            overflow: "auto",
            width: `100%`
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              flexShrink: "0",
              height: `${rowVirtualizer.getTotalSize()}px`,
              justifyContent: "flex-start",
              marginBottom: "auto",
              position: "relative",
              width: "100%"
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > allRows.length - 1;
              const post = allRows[virtualRow.index];

              return (
                <div
                  ref={virtualRow.measureElement}
                  key={virtualRow.index}
                  className={
                    virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                  }
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    // Note: If you don't want to use dynamic heights, you can
                    // also set height here, e.g.:
                    //   height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.end}px)`
                  }}
                >
                  {
                    // Note: The height below should be handled automatically
                    // and able to be dynamic.
                  }
                  <div style={{ height: "100px" }}>
                    {isLoaderRow
                      ? hasNextPage
                        ? "Loading more..."
                        : "Nothing more to load"
                      : post}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
