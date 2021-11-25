import { useEffect, useState } from "react";
import { Subscription } from "rxjs";
import {
  GetDisplayPropertyValue,
  PostDisplayPropertyByID,
} from "../rxjs/DrawState";
import { DEV_ELEMENT_RENDERED } from "../decorators/ElementDecorator";

declare interface WebCreateData {
  compKey: string;
  pkg: string;
  ID: string;
  state?: { [key: string | number]: any };
}

declare interface WebPatchData {
  ID: string;
  slice: { [key: string | number]: any };
}

declare interface WebBusEvent {
  type: "CREATE" | "UPDATE" | "PATCH" | "DELETE"; // types of event
  payload: WebCreateData | WebPatchData; // payload
}

declare function SubscribeSessionWebBus(
  next: (v: WebBusEvent | null) => {}
): Subscription;

declare interface WebDevBusEvent {
  type: string;
  payload: any;
}

declare function SubscribeWebDevBus(
  next: (v: WebDevBusEvent) => {}
): Subscription;

export const useShowProperty = () => {
  const [sessionElements, setSessionElements] = useState<{
    [ID: string]: true;
  }>({});
  useEffect(() => {
    SubscribeSessionWebBus((v) => {
      if (v && v.type === "CREATE") {
        setSessionElements((curr) => {
          return { ...curr, [v.payload.ID]: true };
        });
      }
      return {};
    });
  }, [setSessionElements]);
  useEffect(() => {
    SubscribeWebDevBus((v) => {
      if (v.type === DEV_ELEMENT_RENDERED) {
        // check if the rendered element was created by this user session
        if (sessionElements[v.payload]) {
          console.log("[useShowProperty] PostDisplayPropertyByID called");
          PostDisplayPropertyByID(
            v.payload,
            GetDisplayPropertyValue()?.activeHeader || "Properties" // show last active header or Properties
          );
        }
      }
      return {};
    });
  }, [sessionElements]);
};
