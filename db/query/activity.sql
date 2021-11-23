-- Table: public.issues

-- DROP TABLE IF EXISTS public.issues;

CREATE TABLE IF NOT EXISTS public.issues
(
    issueid integer NOT NULL DEFAULT nextval('issues_issueid_seq'::regclass),
    projectid integer NOT NULL DEFAULT nextval('issues_projectid_seq'::regclass),
    tracker character varying(10) COLLATE pg_catalog."default" NOT NULL,
    subject character varying(20) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    status character varying(11) COLLATE pg_catalog."default" NOT NULL,
    priority character varying(9) COLLATE pg_catalog."default" NOT NULL,
    assignee integer NOT NULL DEFAULT nextval('issues_assignee_seq'::regclass),
    startdate date NOT NULL,
    duedate date NOT NULL,
    createddate timestamp with time zone NOT NULL,
    updateddate timestamp with time zone NOT NULL,
    closeddate date NOT NULL,
    parenttask integer NOT NULL DEFAULT nextval('issues_parenttask_seq'::regclass),
    estimatedtime real NOT NULL,
    done real NOT NULL,
    files json[] NOT NULL,
    spenttime real NOT NULL,
    targetversion character varying(10) COLLATE pg_catalog."default" NOT NULL,
    author integer NOT NULL DEFAULT nextval('issues_author_seq'::regclass),
    CONSTRAINT issues_pkey PRIMARY KEY (issueid),
    CONSTRAINT assignee FOREIGN KEY (assignee)
        REFERENCES public.users (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT author FOREIGN KEY (author)
        REFERENCES public.users (userid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT parenttask FOREIGN KEY (parenttask)
        REFERENCES public.issues (issueid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT projectid FOREIGN KEY (projectid)
        REFERENCES public.projects (projectid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.issues
    OWNER to riko;