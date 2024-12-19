export enum QuestionType {
    MultipleChoice = "MultipleChoice",
    Text = "Text",
    Rating = "Rating"
}

export function formatAnswersByQuestionType(answers: any) {
    return {
        multipleChoice: {},
        text: {},
        rating: {}
    };
} 