package com.backend.learner_placement.services;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.backend.learner_placement.dtos.LearnerDto;
import com.backend.learner_placement.models.Learner;
import com.backend.learner_placement.repository.LearnerRepository;

@Service
public class LearnerService {

	private LearnerRepository learnerRepository;
	private ModelMapper modelMapper;

	public LearnerService(LearnerRepository learnerRepository, ModelMapper modelMapper) {
		this.learnerRepository = learnerRepository;
		this.modelMapper = modelMapper;
	}

	// bulk csv load
	public String saveLearnersFromCsv(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Please upload a valid CSV file!");
        }

        List<Learner> learners = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = br.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }

                String[] data = line.split(","); 
                Learner learner = new Learner();
                learner.setBatch(data[0].trim());
                learner.setAttendance(Integer.parseInt(data[1].trim()));
                learner.setCodingScore(Integer.parseInt(data[2].trim()));
                learner.setAptitudeScore(Integer.parseInt(data[3].trim()));
                learner.setCommunicationScore(Integer.parseInt(data[4].trim()));
                
                learners.add(learner);
            }
            
            learnerRepository.saveAll(learners); 
            return "Successfully uploaded " + learners.size() + " learners from CSV";

        } catch (Exception e) {
            throw new RuntimeException("Failed to process CSV file: " + e.getMessage());
        }
    }
	
	public LearnerDto createLearner(LearnerDto learnerDto) {
		if(learnerDto.getLearnerId() != null && learnerRepository.existsById(learnerDto.getLearnerId())) {
			throw new RuntimeException(learnerDto.getLearnerId()+" already exists");
		}

		Learner learner = modelMapper.map(learnerDto, Learner.class);
		Learner savedLearner = learnerRepository.save(learner);
		return modelMapper.map(savedLearner, LearnerDto.class);
	}

	public List<LearnerDto> getAllLearners(){
		return learnerRepository.
				findAll().
				stream().
				map((Learner learner) -> modelMapper.map(learner, LearnerDto.class)).
				toList();  
	}

	public LearnerDto getLearnerById(Long learnerId) {

		Learner learner = learnerRepository.findById(learnerId).
				orElseThrow(() -> new RuntimeException(learnerId + " not exists"));
		return modelMapper.map(learner, LearnerDto.class);
	}

	public void deleteLearner(Long learnerId) {
		Learner learner = learnerRepository.findById(learnerId).
				orElseThrow(() -> new RuntimeException(learnerId + " not exists"));
		learnerRepository.delete(learner);
	}

	public LearnerDto updateLearner(Long id, LearnerDto learnerDto) {
		Learner existingLearner = learnerRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Learner not found with id: " + id));

		existingLearner.setBatch(learnerDto.getBatch());
		existingLearner.setMentorId(learnerDto.getMentorId());
		existingLearner.setAttendance(learnerDto.getAttendance());
		existingLearner.setCodingScore(learnerDto.getCodingScore());
		existingLearner.setAptitudeScore(learnerDto.getAptitudeScore());
		existingLearner.setCommunicationScore(learnerDto.getCommunicationScore());

		Learner updatedLearner = learnerRepository.save(existingLearner);        
		return modelMapper.map(updatedLearner, LearnerDto.class);
	}
}