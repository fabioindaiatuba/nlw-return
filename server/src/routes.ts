import express from "express";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";
import { PrimaFeedbacksRepository } from "./repositories/prisma/prisma-feedbacks-repository";
import { SubmitFeedbackUseCase } from "./use-cases/submit-feedback-use-case";

export const routes = express.Router();

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "040d7ad337bdd1",
    pass: "af09373b21edfb",
  },
});

routes.post("/feedbacks", async (req, res) => {
  const { type, comment, screenshot } = req.body;
  const prismaFeedbacksRepository = new PrimaFeedbacksRepository();
  const submitFeedbackUseCase = new SubmitFeedbackUseCase(
    prismaFeedbacksRepository
  );

  await submitFeedbackUseCase.excute({
    type,
    comment,
    screenshot,
  });

  await transport.sendMail({
    from: "Equipe Feedget <oi@feesget.com>",
    to: "Fabio Gonçalves <fabioindaiatuba@outlook.com>",
    subject: "Novo feedback",
    html: [
      `<div style="font-family: sans-serif, font-size: 16px, color: #111">`,
      `<p>Tipo do feedback: ${type}`,
      `<p>Comentário: ${comment}`,
      `</div>`,
    ].join("\n"),
  });
  return res.status(201).send();
});
