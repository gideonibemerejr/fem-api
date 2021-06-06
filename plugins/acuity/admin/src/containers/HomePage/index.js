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
  const [userId, setUserId] = useState("");
  const [pk, setPk] = useState("");

  useEffect(() => {
    const loadAcuitySettings = async () => {
      const res = await request(`/${pluginId}/settings`, {
        method: "GET",
      });

      const { pk, userId } = res;

      setPk(pk);
      setUserId(userId);
    };

    loadAcuitySettings();
  }, []);

  const updateSettings = async (e) => {
    e.preventDefault();
    strapi.lockApp();

    try {
      const res = await request(`/${pluginId}/settings`, {
        method: "POST",
        body: {
          pk,
          userId,
        },
      });

      strapi.notification.success(
        "Successfully updated Acuity Scheduling information"
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
            <h1>{toTitleCase(pluginId)} Scheduling</h1>
            <p>Save your Acuity Scheduling information below</p>
            <form onSubmit={updateSettings}>
              <div>
                <label htmlFor="userId">Acuity Scheduling User ID</label>
                <InputText
                  name="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Acuity Scheduling API Key"
                />
              </div>
              <div>
                <label htmlFor="pk">Acuity Scheduling API Key</label>
                <InputText
                  name="pk"
                  type="password"
                  value={pk}
                  onChange={(e) => setPk(e.target.value)}
                  placeholder="Acuity Scheduling API Key"
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
