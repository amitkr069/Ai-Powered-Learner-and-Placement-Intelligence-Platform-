package com.backend.learner_placement.services;

import java.util.HashMap;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.backend.learner_placement.dtos.PredictionDto;
import com.backend.learner_placement.exception.ResourceNotFoundException;
import com.backend.learner_placement.models.Learner;
import com.backend.learner_placement.models.Prediction;
import com.backend.learner_placement.repository.LearnerRepository;
import com.backend.learner_placement.repository.PredictionRepository;

@Service
public class PredictionService {

	private PredictionRepository predictionRepository;
	private LearnerRepository learnerRepository;
	private ModelMapper modelMapper;
	private final RestTemplate restTemplate; 

	private final String PYTHON_API_URL = "http://localhost:8000/predict";
	
	public PredictionService(PredictionRepository predictionRepository, LearnerRepository learnerRepository, ModelMapper modelMapper, RestTemplate restTemplate) {
		this.predictionRepository = predictionRepository;
		this.learnerRepository = learnerRepository;
		this.modelMapper = modelMapper;
		this.restTemplate = restTemplate;
	}

public PredictionDto generateAndSavePrediction(Long learnerId) {
		
		Learner learner = learnerRepository.findById(learnerId).
				orElseThrow(() -> new RuntimeException("Learner not found with id : " + learnerId));
		
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("codingScore", learner.getCodingScore() != null ? learner.getCodingScore() : 0);
		requestBody.put("aptitudeScore", learner.getAptitudeScore() != null ? learner.getAptitudeScore() : 0);
		requestBody.put("attendance", learner.getAttendance() != null ? learner.getAttendance() : 0);
		requestBody.put("communicationScore", learner.getCommunicationScore() != null ? learner.getCommunicationScore() : 0);

		String targetUrl = PYTHON_API_URL + "/" + learnerId;
		PredictionDto responseFromPython = restTemplate.postForObject(targetUrl, requestBody, PredictionDto.class);

		if (responseFromPython == null) {
			throw new RuntimeException("Failed to get response from Python ML API");
		}

		Prediction exist = predictionRepository.findByLearner_LearnerId(learnerId);
		Prediction prediction = (exist != null) ? exist : new Prediction();

		prediction.setLearner(learner);
		prediction.setRecommendation(responseFromPython.getRecommendation());
		prediction.setReadinessScore(responseFromPython.getReadinessScore());

		Prediction saved = predictionRepository.save(prediction);
		PredictionDto response = modelMapper.map(saved, PredictionDto.class);
		response.setLearnerId(learner.getLearnerId());
		return response;
	}

	public PredictionDto getPredictionForLearner(Long learnerId) {

		Prediction prediction = predictionRepository
				.findByLearner_LearnerId(learnerId);

		if (prediction == null) {
			throw new ResourceNotFoundException(
					"Prediction not generated yet for learner id: " + learnerId);
		}

		PredictionDto response = modelMapper.map(prediction, PredictionDto.class);
		response.setLearnerId(prediction.getLearner().getLearnerId());
		return response;
	}

	public PredictionDto updatePrediction(Long predictionId, PredictionDto predicitonDto) {

		Prediction exist = predictionRepository.findById(predictionId).
				orElseThrow(() -> new RuntimeException("Predcition not found with id : "+predictionId));

		exist.setReadinessScore(predicitonDto.getReadinessScore());
		exist.setRecommendation(predicitonDto.getRecommendation());
 
		Prediction updatedPrediction = predictionRepository.save(exist);
		PredictionDto response = modelMapper.map(updatedPrediction, PredictionDto.class);
		return response;
	}

	public void deletePrediction(Long predictionId) {
		
		Prediction exist = predictionRepository.findById(predictionId).
				orElseThrow(() -> new RuntimeException("Predcition not found with id : "+predictionId));
		
		predictionRepository.delete(exist);

	}
}
