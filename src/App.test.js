import React from "react";
import { shallow, mount } from "enzyme";
import Account from "./Account";
import App from "./App";

it("renders correctly", () => {
  const wrapper = mount(<App />);
  expect(wrapper.state("error")).toEqual(null);
});

it("renders without crashing", () => {
  shallow(<App />);
});

it("renders Account header correctly", () => {
  const wrapper = shallow(<App />);
  const header = <h1>Display Active Users Account Details</h1>;
  expect(wrapper.contains(header)).toEqual(true);
});

const user = {
  email: "beullarugero8@gmail.com",
  password: "password",
};

describe("<Account />", () => {
  it("contains account", () => {
    const wrapper = shallow(<Account user={user} />);
    const value = wrapper.find("p").text();
    expect(value).toEqual("beullarugero8@gmail.com");
  });

  it("accepts user account props", () => {
    const wrapper = mount(<Account user={user} />);
    expect(wrapper.props().user).toEqual(user);
  });
});

it("correctly increment the counter", () => {
  const wrapper = shallow(<App />);
  wrapper.find('[id="counter"]').simulate("click");
  wrapper.find('[id="counter"]').simulate("click");
  expect(wrapper.state().counter).toEqual(2);
});