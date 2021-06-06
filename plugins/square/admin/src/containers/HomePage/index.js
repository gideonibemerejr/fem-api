/*
 *
 * HomePage
 *
 */

import React, { memo, useState, useEffect } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import { toTitleCase } from "../../utils";
import { request } from "strapi-helper-plugin";

import * as Styled from "../../components/StrapiStyled";
import { InputText, Button, Padded } from "@buffetjs/core";

const HomePage = () => {
  const [pk, setPk] = useState("");

  useEffect(() => {
    const loadSquareSettings = async () => {
      const res = await request(`/${pluginId}/settings`, {
        method: "GET",
      });
      setPk(res.pk);
    };
    loadSquareSettings();
  }, []);
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <p>Happy coding</p>
    </div>
  );
};

export default memo(HomePage);
