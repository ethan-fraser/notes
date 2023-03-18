export type Tag = {
  id: string;
  tag: string;
  color: string;
};

export type Item = {
  id: string;
  text: string;
  tags: Tag[];
};
