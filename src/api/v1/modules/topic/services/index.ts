import createTopics from './createTopics';

class TopicService {
    createTopics: (courseId: string, courseTitle: string, files?: any, subtopics?: string) => Promise<void> = createTopics
}
export default TopicService;
