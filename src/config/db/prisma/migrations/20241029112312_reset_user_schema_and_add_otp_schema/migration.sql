BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Answer] (
    [id] NVARCHAR(1000) NOT NULL,
    [text] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Answer_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Answer_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [quizId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Answer_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Answer_quizId_key] UNIQUE NONCLUSTERED ([quizId])
);

-- CreateTable
CREATE TABLE [dbo].[Course] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL CONSTRAINT [Course_description_df] DEFAULT '',
    [completed] BIT NOT NULL CONSTRAINT [Course_completed_df] DEFAULT 0,
    [inProgress] BIT CONSTRAINT [Course_inProgress_df] DEFAULT 0,
    [courseType] NVARCHAR(1000) CONSTRAINT [Course_courseType_df] DEFAULT '',
    [difficultyLevel] NVARCHAR(1000) CONSTRAINT [Course_difficultyLevel_df] DEFAULT '',
    [notes] NVARCHAR(1000) CONSTRAINT [Course_notes_df] DEFAULT '',
    [img] NVARCHAR(1000),
    [category] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Course_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Course_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Course_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Course_title_key] UNIQUE NONCLUSTERED ([title])
);

-- CreateTable
CREATE TABLE [dbo].[CourseFile] (
    [id] NVARCHAR(1000) NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CourseFile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [CourseFile_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [courseId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [CourseFile_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[IdeaContent] (
    [id] NVARCHAR(1000) NOT NULL,
    [text] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) CONSTRAINT [IdeaContent_image_df] DEFAULT '',
    [lectureId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [IdeaContent_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [IdeaContent_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [IdeaContent_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LearningMethod] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(255),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [LearningMethod_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [LearningMethod_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LearningMethod_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LearningMethod_userId_key] UNIQUE NONCLUSTERED ([userId])
);

-- CreateTable
CREATE TABLE [dbo].[Lecture] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Lecture_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Lecture_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [position] INT NOT NULL,
    [topicId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Lecture_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Option] (
    [id] NVARCHAR(1000) NOT NULL,
    [text] NVARCHAR(1000) NOT NULL,
    [quizId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Option_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Option_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Option_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Otp] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [otp] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Otp_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Otp_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [expiresAt] DATETIME2 NOT NULL,
    CONSTRAINT [Otp_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Quiz] (
    [id] NVARCHAR(1000) NOT NULL,
    [question] NVARCHAR(255) NOT NULL,
    [explanation] NVARCHAR(1000) CONSTRAINT [Quiz_explanation_df] DEFAULT '',
    [ideaContentId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Quiz_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Quiz_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Quiz_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Quiz_ideaContentId_key] UNIQUE NONCLUSTERED ([ideaContentId])
);

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Topic] (
    [id] NVARCHAR(1000) NOT NULL,
    [title] NVARCHAR(1000) NOT NULL,
    [position] INT NOT NULL,
    [completed] BIT CONSTRAINT [Topic_completed_df] DEFAULT 0,
    [inProgress] BIT CONSTRAINT [Topic_inProgress_df] DEFAULT 0,
    [courseId] NVARCHAR(1000) NOT NULL,
    [lectureId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Topic_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Topic_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Topic_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [roleId] NVARCHAR(1000),
    [emailVerified] BIT NOT NULL CONSTRAINT [User_emailVerified_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [User_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [age] INT,
    [avatar] NVARCHAR(1000) NOT NULL CONSTRAINT [User_avatar_df] DEFAULT '',
    [primaryLearningMethodId] NVARCHAR(1000),
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Video] (
    [id] NVARCHAR(1000) NOT NULL,
    [lectureId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Video_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Video_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Video_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Otp_email_idx] ON [dbo].[Otp]([email]);

-- AddForeignKey
ALTER TABLE [dbo].[Answer] ADD CONSTRAINT [Answer_quizId_fkey] FOREIGN KEY ([quizId]) REFERENCES [dbo].[Quiz]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Course] ADD CONSTRAINT [Course_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CourseFile] ADD CONSTRAINT [CourseFile_courseId_fkey] FOREIGN KEY ([courseId]) REFERENCES [dbo].[Course]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[IdeaContent] ADD CONSTRAINT [IdeaContent_lectureId_fkey] FOREIGN KEY ([lectureId]) REFERENCES [dbo].[Lecture]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[LearningMethod] ADD CONSTRAINT [LearningMethod_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Lecture] ADD CONSTRAINT [Lecture_topicId_fkey] FOREIGN KEY ([topicId]) REFERENCES [dbo].[Topic]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Option] ADD CONSTRAINT [Option_quizId_fkey] FOREIGN KEY ([quizId]) REFERENCES [dbo].[Quiz]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Quiz] ADD CONSTRAINT [Quiz_ideaContentId_fkey] FOREIGN KEY ([ideaContentId]) REFERENCES [dbo].[IdeaContent]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Topic] ADD CONSTRAINT [Topic_courseId_fkey] FOREIGN KEY ([courseId]) REFERENCES [dbo].[Course]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Video] ADD CONSTRAINT [Video_lectureId_fkey] FOREIGN KEY ([lectureId]) REFERENCES [dbo].[Lecture]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
