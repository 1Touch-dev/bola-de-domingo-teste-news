"use client";

import { useArticlesQuery } from "@/hooks/useArticlesQuery";
import { deskFeedEndpoints, HOME_ARTICLE_ENDPOINT } from "@/lib/cmsEndpoints";

interface IEndpointSyncProps {
  endpoint: string;
}

const EndpointSync = (props: IEndpointSyncProps) => {
  const { endpoint } = props;
  useArticlesQuery({ page: 1, limit: 20, endpoint });
  return null;
};

export const SportsSync = () => {
  useArticlesQuery({ page: 1, limit: 40, endpoint: HOME_ARTICLE_ENDPOINT });

  return (
    <>
      {deskFeedEndpoints.map((endpoint) => (
        <EndpointSync key={endpoint} endpoint={endpoint} />
      ))}
    </>
  );
};
