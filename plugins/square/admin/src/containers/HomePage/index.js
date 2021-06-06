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

  const updateSettings = async (e) => {
    e.preventDefault();
    strapi.lockApp();

    try {
      const res = await request(`/${pluginId}/settings`, {
        method: "POST",
        body: {
          pk,
        },
      });

      res &&
        strapi.notification.success(
          "Successfully updated Square Payments information"
        );
    } catch (error) {
      strapi.notification.error(error.toString());
    }

    strapi.unlockApp();
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Styled.Container>
          <Styled.Block>
            <h1>{toTitleCase(pluginId)} Payments</h1>
            <p>Save your Square Payments information below</p>
            <form onSubmit={updateSettings}>
              <div>
                <label htmlFor="pk">Square Payments API Key</label>
                <InputText
                  name="pk"
                  type="password"
                  value={pk}
                  onChange={(e) => setPk(e.target.value)}
                  placeholder="Square Payments API Key"
                />
              </div>
              <Padded top>
                <Button color="primary" label="Submit" type="submit" />
              </Padded>
            </form>
          </Styled.Block>
        </Styled.Container>
      </div>
    </div>
  );
};

export default memo(HomePage);
