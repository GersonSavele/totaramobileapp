import { ResourceState } from "@totara/types/Resource";

const downloadItemMockAdded = {
  id: "1",
  name: "Resource 1MB",
  state: ResourceState.Added,
  sizeInBytes: 1024 * 1024 //1MB
};

const downloadItemMockAddedWithKilo = {
  id: "1",
  name: "Resource 10KB",
  state: ResourceState.Added,
  sizeInBytes: 1024 * 10 //10KB
};

export { downloadItemMockAdded, downloadItemMockAddedWithKilo };
