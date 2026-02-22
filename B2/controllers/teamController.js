import mongoose from "mongoose";
import Team from "../models/Team.js";
import TeamInvite from "../models/TeamInvite.js";

export const createTeam = async (req, res, next) => {
    try {
        const newTeam = {
            teamName : req.body.teamName,
            teamMembers : [req.User._id],
            memberNumbers : 1,
            teamOwner : req.User._id,
        }
        const result = await Team.create(newTeam);
        return res.status(201).json({
            status : "success",
            message : "created a team"
        })
    } catch (err) {
        return res.status(404).json({
            status : "failed",
            message : err,
        })
    }
    
}

export const deleteTeam = async (req, res, next) => {
    try {
        const result = await Team.findOne({teamName : req.body.teamName});
        if (!result) {
            return res.status(404).json({
                status : "failed",
                message : "can't find the team"
            })
        }
        if (result.teamOwner != req.User._id){
            return res.status(402).json({
                status : "failed",
                message : "permission denied"
            })
        }
        const deleteResult = await Team.deleteOne({_id : result._id});
        return res.status(201).json({
            status : "success",
            message : "team deleted"
        })
    } catch (err) {
        return res.status(404).json({
            status : "failed",
            message : err,
        })
    }
}

export const getTeam = async (req, res, next) => {

}

export const addTeamMate = async (req, res, next) => {
    
}

export const deleteTeamMate = async (req, res, next) => {

}

export const changeCreator = async (req, res, next) => {

}

export const sendInvite = async (req, res, next) => {

}

export const recieveInvites = async (req, res, next) => {

}

export const makeDecision = async (req, res, next) => {

}

export const getUserTeam = async (req, res, next) => {
    try {
        const myTeams = await Team.find({ members: req.User._id })
                                    .select("teamName createdAt members -_id")
                                    .populate({path: 'teamMembers'});
        return res.status(200).json({
          status: "success",
          results: myTeams.length,
          data: myTeams
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ status: "failed", message: "Error retrieving teams" });
      }
}