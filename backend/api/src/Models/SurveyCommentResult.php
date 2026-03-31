<?php

namespace App\Models;

/**
 * Classe SurveyCommentResult.
 * @package App\Models
 * @author Jean-Christophe Demers
 */
class SurveyCommentResult
{
	/**
	 * @var string Commentaire d'un formulaire d'évaluation.
	 */
	public string $comment;
	
	/**
	 * @var int ID de l'évaluation à cette question.
	 */
	public int $evaluation_id;

	/**
	 * SurveyQuestionResult constructeur.
	 * @param mixed $surveyQuestionResultJSON
	 */
    public function __construct($surveyQuestionResultJSON)
    {
        $this->comment = $surveyQuestionResultJSON["comment"];
		$this->evaluation_id = $surveyQuestionResultJSON["evaluation_id"];
    }
}