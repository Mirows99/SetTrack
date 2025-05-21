This project is to learn how to build a next.js app, understanding how the usage of databases work, using this project to work into workflow automation with n8n and deploying it on coolify.

This project is supposed to be a gym-training tracker. It is supposed to be very lean. 
Available features should be: 
    - user creating / profile management
    - create complete workouts
        - this should be a template of a training which can be started later. This should atleast one excercise with planned amount of sets, reps 
    - start workouts
    - create excercises
    - start single excercises
    - recording of set, reps, weight.. for each excercise in a workout
    - set rest times for between sets
    - track physical stats and goals like wight

Main usage of this app:
    - create workout templates by adding excersices from a preset of the most basic ones or creating own excercises.
    - start your training by starting your workout. Time should be tracked until workout is done 
    - template guides you thought your training, telling you what excercises to do and in which order
        (- the order is not fixed and can be changed dynamically during the training)
        (- also whole excersices should be able to be added/changed/deleted dynamically)
    - for each excercise in the workout you add each set you have done containing the reps, weight, intensity..
    - after adding each set an timer should run (lenght should be set in the creation of profile, default is 90 sec)
    - when workout is done show overview

    alternativly:
    - dont have to use template, just track excercises individually

Planned feature if the basics are set:
    - use n8n workflows and AI Agents to created an automated workout
        - the workflow should get you workout history 

db contains
    - workout tempalte
        - id
        - name
        - body parts
    - excercises
        - id
        - name
        - primary bodypart
        - secondary bodypart
        - 