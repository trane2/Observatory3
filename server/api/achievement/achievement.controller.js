'use strict';

// TODO - use `const` instead of `var`
var _ = require('lodash');
var Achievement = require('./achievement.model');

// TODO - abstract into /api/lib/helpers
function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// TODO - abstract into /api/lib/helpers
function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

// TODO - abstract into /api/lib/helpers
function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

// TODO - abstract into /api/lib/helpers
function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

// TODO - abstract into /api/lib/helpers
function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// // // //
/**
* @api {get} /api/achievements Index
* @apiName index
* @apiGroup Achievements
* @apiDescription Get list of Achievements
* @apiPermission public
* @apiSuccess {Collection} root Collection of all active Observatory Achievements.
* @apiError (500) UnknownException Could not retrieve Achievement collection
*/
// Gets a list of Achievements
exports.index = function(req, res) {
  Achievement.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// // // //
/**
* @api {get} /api/achievements Show
* @apiName show
* @apiGroup Achievements
* @apiDescription Get a single achievement
* @apiPermission public
* @apiSuccess {String} name Single Achievement
* @apiError (500) UnknownException Could not retrieve Achievement collection
*/
// Gets a single Achievement from the DB
exports.show = function(req, res) {
  Achievement.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

/**
* @api {get} /api/achievements Create
* @apiName create
* @apiGroup Achievements
* @apiDescription Creates a new achievement
* @apiPermission public
* @apiSuccess {String} name New instance of an Achievement
* @apiError (500) UnknownException Could not create the Achievement
*/
// Creates a new Achievement in the DB
exports.create = function(req, res) {
  Achievement.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

/**
* @api {get} /api/achievements Update
* @apiName update
* @apiGroup Achievements
* @apiDescription Updates an existing Achievement
* @apiPermission public
* @apiSuccess {String} name Updated Achievement
* @apiError (500) UnknownException Could not update the Achievement
*/
// Updates an existing Achievement in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Achievement.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

/**
* @api {get} /api/achievements Destroy
* @apiName destroy
* @apiGroup Achievements
* @apiDescription Deletes a selected achievement
* @apiPermission public
* @apiSuccess {String} name Deleted Achievement
* @apiError (500) UnknownException Could not delete the Achievement
*/
// Deletes a Achievement from the DB
exports.destroy = function(req, res) {
  Achievement.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
