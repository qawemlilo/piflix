"use strict";

const knex = require('../db.connection').knex();
const log = require('electron-log');

Object.assign(console, log.functions);


class BaseModel {

  id = null;


  query = null;


  table;


  props = {};


  constructor(props=null) {
    if (props) {
      Object.assign(this.props, props);
      this.setProps(this.props);
    }
  }


  async save(props) {
    let res = false;

    try {
      if (props) {
        Object.assign(this.props, props);
        this.setProps(this.props);
      }

      res = await knex(this.table).insert(this.props);

      this.id = res[0];

      return res[0];
    }
    catch (error) {
      return res;
    }
  }


  setProps(props) {
    if (props) {
      this.props = props;

      for (const key in props) {
        if (props.hasOwnProperty(key)) {
          this[key] = props[key];
        }
      }
    }
  }


  async find(id) {
    let model = null;
    let Constructor = this.constructor;

    try {
      const res = await knex(this.table)
      .where('id', id)
      .select();

      if (res) {
        model = new Constructor(Object.assign(res[0], {table: this.table}))
      }

      return model;
    }
    catch (error) {
      return model;
    }
  }


  async findJSON(id) {
    let model = null;

    try {
      const res = await knex(this.table)
      .where('id', id)
      .select();

      return res[0]
    }
    catch (error) {
      return model;
    }
  }


  async fetch(opts = {}) {
    let results = [];
    let Constructor = this.constructor;

    try {
      results = await knex(this.table).select();

      return results.map((row) => {
        return new Constructor(Object.assign(row, {table: this.table}))
      });
    }
    catch (error) {
      console.error(error)
      return results;
    }
  }


  async fetchJSON(opts = {}) {
    let results = [];

    try {
      results = await knex(this.table).select();

      return results;
    }
    catch (error) {
      console.error(error)
      return results;
    }
  }


  async search(opts = {}) {
    let results = [];
    let limit = opts.limit || 10;
    let page = opts.page || 0;
    let Constructor = this.constructor;

    try {
      let query = knex(this.table);

      if (opts.where) {
        query.where(opts.where);
      }

      if (opts.andWhere) {
        query.andWhere(opts.where);
      }

      query.limit(limit);
      query.offset(page * limit);

      if (opts.filter) {
        query.orderBy(opts.filter, opts.order || 'desc');
      }

      results = await query.select();

      return results.map((row) => {
        return new Constructor(Object.assign(row, {table: this.table}))
      });
    }
    catch (error) {
      console.error(error)
      return results;
    }
  }


  async searchJSON(opts = {}) {
    let results = [];
    try {
      results = await knex(this.table)
        .select()
        .limit(opts.limit || 10)
        .offset(opts.offset || 0);

      return results;
    }
    catch (error) {
      console.error(error)
      return results;
    }
  }


  async update(data, opts) {
    let result = false;

    opts = Object.assign({id: this.id}, opts)

    try {
      result =  await knex(this.table)
        .where(opts)
        .update(data);

      this.setProps(data);

      return result;
    }
    catch (error) {
      console.error(error)
      return result
    }
  }

  knex() {
    return knex;
  }
}

module.exports = BaseModel
