import React from "react";

export interface DecoratorCreatorProps {
  decorators: React.FC<any>[];
  ID: string;
  style?: React.CSSProperties;
}

export const DecoratorCreator: React.FC<DecoratorCreatorProps> = (props) => {
  const DirectChildren = props.decorators[0];
  return (
    <DirectChildren ID={props.ID} style={props.style}>
      {props.decorators.length >= 2 ? (
        <DecoratorCreator
          decorators={props.decorators.slice(1)}
          ID={props.ID}
          children={props.children}
        />
      ) : (
        props.children
      )}
    </DirectChildren>
  );
};