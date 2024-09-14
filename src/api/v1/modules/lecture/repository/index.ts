import prisma from '../../../../../config/db/prisma'
import { IIdeaContent } from '../../../../../types'

class LectureRepository {
  model = prisma.lecture

  createOne = async ({
    title,
    ideaContents,
    videos,
    position,
    topicId,
  }: {
    title: string
    ideaContents: { create: string[] }
    videos: { create: string[] }
    position: number
    topicId: string
  }): Promise<any> => {
    const lecture = await this.model.create({
      data: {
        title,
        ideaContents,
        position,
        videos,
        topicId,
      },
    })
    return lecture
  }

  findById = async (id: string) => {
    const lecture = await this.model.findUnique({ where: { id } })
    return lecture
  }
  findByTopicId = async (topicId: string) => {
    const lectures = await this.model.findMany({ where: { topicId } })
    return lectures
  }

  // updateVideoAndContent = async (
  //   id: string,
  //   videos: { id: string }[],
  //   ideaContents: IIdeaContent[]
  // ): Promise<any> => {
  //   // Step 1: Update the main entity with basic fields
  //   const update = await this.model.update({
  //     where: { id },
  //     data: {
  //       videos: {
  //         set: videos.map((video) => ({ id: video.id })),
  //       },
  //     },
  //   });
  
  //   // Step 2: Use createMany for videos
  //   await prisma.video.createMany({
  //     data: videos.map((video) => ({
  //       id: video.id,
  //       lectureId: id, // Assuming lectureId is the foreign key
  //     })),
  //   });
  
  //   // Step 3: Use individual create operations for ideaContents and their nested quizzes
  //   await Promise.all(
  //     ideaContents.map(async (content) => {
  //       const createdContent = await prisma.ideaContent.create({
  //         data: {
  //           text: content.text,
  //           image: content.imageDescription,
  //           lectureId: id, // Assuming lectureId is the foreign key
  //         },
  //       });
  
  //       if (content.quiz) {
  //         await prisma.quiz.create({
  //           data: {
  //             question: content.quiz.question,
  //             explanation: content.quiz.explanation,
  //             ideaContentId: createdContent.id, // Assuming ideaContentId is the foreign key
  //             options: {
  //               create: (content.quiz.options ?? []).map((option) => ({
  //                 text: option,
  //               })),
  //             },
  //             answers: {
  //               create: [{ text: content.quiz.correct_answer }],
  //             },
  //           },
  //         });
  //       }
  //     })
  //   );
  
  //   return update;
  // };
  
  updateVideoAndContent = async (
    id: string,
    videos: { id: string }[],
    ideaContents: IIdeaContent[]
  ): Promise<any> => {
    // Step 1: Use upsert to create or update videos (this will ensure the relationship exists properly)
    await Promise.all(
      videos.map(async (video) => {
        await prisma.video.upsert({
          where: { id: video.id },
          update: { lectureId: id }, // Update if the video already exists
          create: { id: video.id, lectureId: id }, // Create if the video doesn't exist
        });
      })
    );
  
    // Step 2: Update the main entity with basic fields and connect the videos (ensure the videos exist first)
    const update = await this.model.update({
      where: { id },
      data: {
        videos: {
          // If the videos already exist, use `connect` to establish the relationship
          connect: videos.map((video) => ({ id: video.id })),
        },
      },
    });
  
    // Step 3: Use individual create operations for ideaContents and their nested quizzes
    await Promise.all(
      ideaContents.map(async (content) => {
        const createdContent = await prisma.ideaContent.create({
          data: {
            text: content.text,
            image: content.imageDescription,
            lectureId: id, // Assuming lectureId is the foreign key
          },
        });
  
        if (content.quiz) {
          await prisma.quiz.create({
            data: {
              question: content.quiz.question,
              explanation: content.quiz.explanation,
              ideaContentId: createdContent.id, // Assuming ideaContentId is the foreign key
              options: {
                create: (content.quiz.options ?? []).map((option) => ({
                  text: option,
                })),
              },
              answers: {
                create: [{ text: content.quiz.correct_answer }],
              },
            },
          });
        }
      })
    );
  
    return update;
  };
  
  getIdeaContents = async (lectureId: string) => {
    const lecture = await this.model.findUnique({
      where: { id: lectureId },
      include: {
        ideaContents: {
          include: {
            quizzes: {
              include: {
                options: true,
                answers: true,
              },
            },
          },
        },
        videos: true, 
      },
    });
  
    return lecture;
  };
  
  
  

  updateOne = async ({
    id,
    updateInfo,
  }: {
    id: string
    updateInfo: Record<string, string[]>
  }) => {
    const updated = await this.model.update({ where: { id }, data: updateInfo })
    return updated
  }
}

export default LectureRepository
