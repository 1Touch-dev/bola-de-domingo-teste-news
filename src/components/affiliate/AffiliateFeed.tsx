import { Children, Fragment, type ReactNode } from "react";
import AffiliateBanner from "./AffiliateBanner";

interface IAffiliateFeedProps {
  children: ReactNode;
  cards?: boolean;
  list?: boolean;
}

// Short card grids may use one slot; longer feeds earn a slot every six items.
export const AffiliateFeed = (props: IAffiliateFeedProps) => {
  const { children, cards = false, list = false } = props;
  const items = Children.toArray(children);
  const Slot = list ? "li" : "div";
  return items.map((child, index) => {
    const shortCardSlot = cards && items.length >= 3 && items.length < 6 && index === items.length - 1;
    const placement = (index + 1) % 6 === 0 || shortCardSlot;
    const card = cards && ((index + 1) % 12 !== 0 || shortCardSlot);
    return (
      <Fragment key={index}>
        {child}
        {placement ? (
          <Slot className={card ? "flex min-w-0 items-center" : "col-span-full min-w-0 py-4"} style={{ border: 0, background: "transparent" }}>
            <AffiliateBanner preset={card ? "card" : (index + 1) % 12 === 0 ? "strip" : "landscape"} />
          </Slot>
        ) : null}
      </Fragment>
    );
  });
};
