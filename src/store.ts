import { Component, ReactElement } from "react";

const reactionsMap = {};
let currentlyRenderingComponent;

const handler = {
  get: function (target, key) {
    if (typeof currentlyRenderingComponent === "undefined") {
      return target[key];
    }
    if (!reactionsMap[key]) {
      reactionsMap[key] = [currentlyRenderingComponent];
      return target[key];
    }
    const hasComponent = reactionsMap[key].find(
      (comp) => comp.ID === currentlyRenderingComponent.ID
    );
    if (!hasComponent) {
      reactionsMap[key].push(currentlyRenderingComponent);
    }
    return target[key];
  },

  set: function (target, key, value) {
    reactionsMap[key].forEach((component: Component) =>
      component.forceUpdate()
    );
    target[key] = value;
    return true;
  },
};

export function store(object) {
  return new Proxy(object, handler);
}

export function view(MyComponent) {
  return class Observer extends MyComponent {
    ID = `${Math.floor(Math.random() * 10e9)}`;
    static displayName = `${MyComponent.name}__Observer`;

    render() {
      currentlyRenderingComponent = this;
      const renderValue = super.render();
      currentlyRenderingComponent = undefined;
      return renderValue;
    }
  };
}

window.reactionsMap = reactionsMap;
